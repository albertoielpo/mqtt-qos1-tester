#!/bin/bash

# Check if resources/config.json is staged for commit
if git diff --cached --name-only | grep -q "^resources/config.json$"; then
    # File is staged, check if password field is populated
    password_length=$(git show :resources/config.json | grep "password" | awk '{print $2}' | wc -c)
    
    if [ "$password_length" -gt 4 ]; then
        echo "Error: Password field is populated in resources/config.json"
        echo "Please remove the password before committing."
        exit 1
    fi
fi

exit 0