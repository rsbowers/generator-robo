![Robo Logo](https://github.com/rsbowers/generator-robo/blob/master/robo.svg)

# Static site builder generator & CMS component compiler

> Yeoman generator using Grunt, Assemble.io, Handlebars, and Node - lets you quickly set up a project following best practices.


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
* fontawesome

These packages are installed optionally depending on your configuration:

* bootstrap-sass-official

All of these can be updated with `bower update` as new versions are released.

## Project Structure (APP)

Overview

    └── app
        ├── fonts                 - FontAwesome is included by default
        ├── images                
        ├── scripts               - All js files
        ├── styles                - Global Sass files
        │   ├── common            - Individual Sass files for shared elements
        │   ├── components        - Component Sass files
        │   └── lib               - Vendor Sass files (fontawesome, etc.)
        └── templates             - Assemble assets
            ├── data              - JSON data files
            ├── layouts           - Default page template
            ├── pages             - Page-level hbs
            └── partials          - Partial hbs
                ├── components    - Component-level hbs
                └── global        - Shared element hbs (i.e.non-Component partials)

## Project Structure (BUILD)

Overview

    └── dist
        ├── cms                                - Custom assets: fonts, images, etc…
        │   ├── cms.global                     - Global assets (i.e. non-component)
        │   │   ├── css                        - CSS, everything but the components
        │   │   ├── fonts                      - Font assets
        │   │   ├── images                     
        │   │   └── js                         - Un-minified global js (i.e. non-component)
        │   └── cms.component                  - Each component receives this structure
        │       ├── component.css              - Component css
        │       ├── component.hbs              - Component hbs
        │       ├── component.html             - Raw component html
        │       ├── component-preview.html     - Component html, preview mode (i.e. with css/js)
        │       ├── component.js               - Component js
        │       └── component.json             - Component JSON used by Assemble
        └── site                               - Compiled Assemble static site
            ├── fonts                          - Font assets
            ├── images                         
            ├── scripts                        - Minified js
            │   ├── components.js              - All components js
            │   ├── main.js                    - Global js
            │   └── vendor.js                  - Vendor js
            └── styles                         - Minified css
                ├── main.css                   - Complete site css
                └── vendor.css                 - Vendor css



## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
