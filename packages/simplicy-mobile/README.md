### Install dependencies

```shell
cd packages/simplicy-mobile
npm i
```

### Browser based development

- You need account on https://accounts.simplicy.io to continue development.
- Serve development with command `npm run start`. It start development server at http://localhost:4200.
- After login the callback will try to open `simplicy://callback?code=xxxx&state=yyyy`;
- This works on mobile apps and the app will open with the custom scheme to proceed with getting access token and logging in.
- Except for the uri scheme copy remaining string e.g. `callback?code=xxxx&state=yyyy`.
- Open browser window where dev app is running and paste the string after base url. e.g. `http://localhost:4200/callback?code=xxxx&state=yyyy`
- This will give you all the things user specific things in `localStorage`.
- User `StorageService` to change state of storage, it broadcasts changes using observable.
