# Static site builder generator & CMS component compiler

> Yeoman generator using Grunt, Assemble.io, Handlebars, and Node - lets you quickly set up a project following best practices.

## Project Overview

Lorem Ipsum

## Example project

Generated with defaults: http://fullstack-demo.herokuapp.com/.

Source code: https://github.com/DaftMonk/fullstack-demo

## Usage

First, clone this project...

Now, since you have the generator locally, it's not yet available as a global npm module. A global module may be created and symlinked to a local one, using npm. Here's what you'll want to do:

On the command line, from the root of your generator project (in the generator-robo/ folder), type:

Create an npm symlink:
```
npm link
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo robo`, optionally passing an app name:
```
yo robo [app-name]
```

Run `grunt serve` for local development, and `grunt build` to process the CMS components.

## Generators

Available generators:

* App
    - [robo](#app)
* Client Side
    - [robo:component](#component)
    - [robo:page](#page)

### App
Sets up a new app, generating all the boilerplate you need to get started.

Example:
```bash
yo robo
```

### Component
Generates a new component.


Example:
```bash
yo robo:component hero
[?] What will the name of your component be? hero
[?] Will you be needing a js file for this component? Y/n
```

Produces:

    app/styles/components/_hero.scss
    app/templates/partials/components/hero.hbs
    app/scripts/hero.js (optional)

### Page
Generates a new page.

Example:
```bash
yo robo:page About
[?] What will the url of your page be? about
```

Produces:

    app/templates/pages/about.hbs
    app/templates/data/about.json


## Bower Components

The following packages are always installed by the [app](#app) generator:

* jquery
* modernizr

These packages are installed optionally depending on your configuration:

* bootstrap-sass-official

All of these can be updated with `bower update` as new versions are released.

## Project Structure (APP)

Overview

    └── app
        ├── fonts                 - All of our app specific components go in here
        ├── images                - Custom assets: fonts, images, etc…
        ├── scripts               - Our reusable components, non-specific to to our app
        ├── styles                - Custom assets: fonts, images, etc…
        │   ├── common            - Our apps server api
        │   ├── components        - Our reusable or app-wide components
        │   └── lib               - Server rendered views
        └── templates             - Custom assets: fonts, images, etc…
            ├── data              - Our apps server api
            ├── layouts           - Our reusable or app-wide components
            ├── pages             - Our reusable or app-wide components
            └── partials          - Server rendered views
                ├── components    - Our reusable or app-wide components
                └── global        - Server rendered views

## Project Structure (BUILD)

Overview

    └── dist
        ├── cms                                - All of our app specific components go in here
        ├── images                             - Custom assets: fonts, images, etc…
        ├── scripts                            - Our reusable components, non-specific to to our app
        ├── cms                                - Custom assets: fonts, images, etc…
        │   ├── cms.global                     - Our apps server api
        │   │   ├── css                        - Our apps server api
        │   │   ├── fonts                      - Our apps server api
        │   │   ├── images                     - Our apps server api
        │   │   └── js                         - Server rendered views
        │   └── cms.component                  - Server rendered views
        │       ├── component.css              - Our apps server api
        │       ├── component.hbs              - Our apps server api
        │       ├── component.html             - Our apps server api
        │       ├── component-preview.html     - Our apps server api
        │       ├── component.js               - Our apps server api
        │       └── component.json             - Server rendered views
        └── site                               - Custom assets: fonts, images, etc…
            ├── fonts                          - Our apps server api
            ├── images                         - Our reusable or app-wide components
            ├── scripts                        - Our reusable or app-wide components
            └── styles                         - Server rendered views


## Contribute

Lore  Ipsum

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
