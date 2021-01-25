# Eyetracking Client

![alt text](./media/helloex3.gif)

## Getting Started

This app provides a virtual keyboard that enables the user to type using a connected eyetracking device.

### Installation
```npm install```

```npm install -g foreman```

### Running the app
```npm run start```

## About

This app leverages our custom [eyetracking](https://github.com/EyeTrackingCSE/eyetracking) module to bind Tobii `GazeFocusEvent` to a virtual keyboard, enabling the user to type using their eyes.

The app is built using [React.js](https://reactjs.org/) running within [Electron.js](https://www.electronjs.org/). It communicates with [eyetracking](https://github.com/EyeTrackingCSE/eyetracking) by forking an independent process for the device, and communicating gaze data to the Electron renderer process via IPC.

## CSE 4317 Documentation 

- [Project Charter](./documentation/project_charter.pdf)
- [Architectural Design Specification](./documentation/architectural_design_specification.pdf)
- [System Requirments Specification](./documentation/system_requirements_specification.pdf)
