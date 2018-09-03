# Estonia Transportation App


**Requirement/s:**
[Create-react-app](https://github.com/facebook/create-react-app#creating-an-app) - build, transpile, compile our javascripts and assets.

### Running on local machine


*Note: Create a postgres sql database*
1. Clone the repository
> `git clone https://github.com/symphco/estonia-transpo-demo.git`
2. Change directory to `estonia-transpo-demo`
> `cd estonia-transpo-demo`
3. Create `.env` file to the root directory:
```
  DB_NAME=
  DB_USERNAME=
  DB_PASSWORD=
  SECRET_KEY=
  GOOGLE_API_KEY=
```
4. Create a virtual environment
> `virtualenv venv`
5. Activate the virtual environment
> `source venv/bin/activate`
6. Install the dependencies
> `pip install -r requirements.txt`
7. Initialize the database
> `python manage.py migrate`
8. Run Server
> `python manage.py runserver`
9. Run the react-app for development
> `npm run start`

*Important: To bundle react app just run*
> `npm run build`

### Deployment

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
  # or
  npm run build

  # Collect static files via Django
  python manage.py collectstatic
  
  # Reload UWSGI server to reflect changes
  uwsgi --reload /tmp/estoniatranspo.pid
  # or
  touch /tmp/estoniatranspo
```
