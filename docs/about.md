# About the App

In this page you'll find information about the purpose of this app, the technologies used within the app, and a brief tour of the application structure.

## File Structure

```
.
|- app: This contains the code for the application page layouts and routing.
|- assets: Non-code assests use within the application such as icons and images.
|- components: React components used in multiple pages in the application.
|- constants: Constant data for the application such as color schemes.
|- data: Helper functions for managing the SQLite database.
|- docs: You are here. Contains in-depth documentation about the app.
|- app.json: Expo Go project metadata file.
|- babel.config.js: Metadata for compatibilty across multiple platforms. Managed by Expo Go and should be left alone.
|- eas.json: Expo Application Services project metadata file.
|- flake.lock: Lock file for Nix package manager (see `Developing With Nix`).
|- flake.nix: Nix project definition file.
|- package.json: Node.js packages and project definition file.
|- shell.nix: Nix portable development environments.
|- yarn.lock: Lock file for Node.js project using Yarn for package management.
```
