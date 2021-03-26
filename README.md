# Eyetracking Client

![alt text](./media/helloworld4.gif)

## About

This app leverages our custom [eyetracking](https://github.com/EyeTrackingCSE/eyetracking) module to bind a Tobii eyetracking device to a virtual keyboard, enabling the user to type using their eyes.

The app is built using [React.js](https://reactjs.org/) and [Electron.js](https://www.electronjs.org/). The [eyetracking](https://github.com/EyeTrackingCSE/eyetracking) module is implemented as a [node-gyp C++ addon](https://nodejs.org/api/addons.html).

## Getting Started

### Installation

#### Installation Script

This repo contains an installation script to automate dependency installation and version checks.

```npm run setup-env```

#### Manual Installation

If you wish to install the parts manually:

```npm install```

```npm install -g foreman```

If you have an eyetracking device, you need to rebuild the [eyetracking](https://github.com/EyeTrackingCSE/eyetracking) module (it is written as a C++ addon). You also need `node-gyp` installed on your machine if you don't have it already.

```npm install -g node-gyp```

```npm run eyetracking-rebuild```

### Running the app
```npm run start```

## CSE 4317 Documentation 

- [Video Presentation](https://www.youtube.com/watch?v=iR_qDEg4TU8)
- [Project Charter](./documentation/project_charter.pdf)
- [Architectural Design Specification](./documentation/architectural_design_specification.pdf)
- [System Requirments Specification](./documentation/system_requirements_specification.pdf)
- [Detailed Design Specification](./documentation/dds.pdf)

