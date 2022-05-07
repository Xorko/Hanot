# Hanot

_Handwriting annotation tool_

Hanot is a multiplatform tool, written in React Native, that is used to annotate InkML and image files containing handwriting. Its purpose is to divide a word written in cursive script and to assign the corresponding letter to each division.

It has been developped for [IntuiDoc](https://www-intuidoc.irisa.fr/) and [Lacodam](https://team.inria.fr/lacodam/fr/) teams of [IRISA](https://www.irisa.fr/) during our first year of software engineering master's degree at [Université de Rennes 1](https://www.univ-rennes1.fr/).

<figure>
  <p align="center">
    <img src="https://s8.gifyu.com/images/hanot.gif" alt="InkML annotation example" />
  </p>
  <p align="center">
    <i>InkML annotation example</i>
  </p>
</figure>

## Running the app

> ⚠️ [Please be sure your environment is set up correctly for React Native CLI.](https://reactnative.dev/docs/environment-setup)

### Web

#### Development

Run the app: `yarn web`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### Production

Build the app: `yarn build-web`
Use the app `npx serve -s build/`

### Electron

#### Windows

Build the app: `yarn electron:package:win`
Run the app in the `dist` directory

#### MacOS

Build the app: `electron:package:mac`
Run the app in the `dist` directory

#### Linux

Build the app: `electron:package:linux`
Run the app in the `dist` directory

### Native

1. Start Metro Bundler: `yarn start`
2. Start the Android app: `yarn android`
3. Start the iOS app: `yarn ios` (make sure you have installed pods first! `yarn ios:pods` if needed)

## Development Tools

1. Check your code style with `yarn lint:all` (runs eslint, prettier, and tsc)
1. Check your code correctness with `yarn test:all` (runs jest)

## Authors

- [Thibault LE GOFF](https://github.com/Xorko)
- [Benoît AGOGUÉ](https://github.com/agoguebenoit)
- [Damien MERANTHE](https://github.com/damienMS)
- [Marion GRASSI](https://github.com/MarionGrassi)
- [Emile LE MOIGNE](https://github.com/emile-le-moigne)
- [Brett BECKER](https://github.com/BrettBeck)
- [Sindbad LOUIS](https://github.com/jownline)
- [Inès TOUATI](https://github.com/InesTouati)
- [Heming WANG](https://github.com/nep-nep327)
- [Ammar KAZEM](https://github.com/Ammar96399)
