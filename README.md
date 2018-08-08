# Estonia Transportation App

```
  # Create a virtual environment
  virtualenv venv
  
  # Activate the virtual environment
  source venv/bin/activate
  
  # Install the dependencies
  pip install -r requirements.txt 
  
  # Initialise the database
  python manage.py migrate
  
  # Run the server
  python manage.py runserver
```

# Deployment

```
  # Login via SSH
  ssh [VM IP Address]

  # Navigate to project folder
  cd estonia-transpo-demo/

  # Fetch
  git fetch

  # Rebase
  git rebase origin/master

  # Install NPM dependencies
  npm install

  # Activate python virtual environment
  source env/bin/activate

  # Install Python dependencies
  pip install -r requirements.txt

  # Build React app
  yarn build

  # Collect static files via Django
  python manage.py collectstatic
  
  # Restart machine (TODO: reflecting deployment changes without restarting machine)
  sudo shutdown -r 0
```
