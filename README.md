# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Running the Program (Windows)
1. Clone this repo https://github.com/jjustisk/Parking-Analytics-Dashboard
Install from here if not installed

https://nodejs.org/en/download

2. npm install
3. Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    - I had to run the above command to temporarily allow scripts on my machine. Skip if npm install runs 
4. npm run dev
5. Open Local Browser

## Running the Program (WSL)
I built this while on WSL, but realised while testing. The program may need to run on Windows

1. Clone this repo https://github.com/jjustisk/Parking-Analytics-Dashboard

Run this if nodejs not installed:

sudo apt update
sudo apt install nodejs npm -y
node -v
npm -v

2. npm install
3. npm run dev


## AI use
Originally, I wanted to try and limit my AI use as i wanted to attempt this as best as I could possibly coudld. This was my first time parsing .csv data using React, so i found that the most common way was using Papaparse. I asked ChatGPT:

- "Whats the best way to integrate CSV data into an React app?"

After solving that issue, the rest of the app was pretty straightforward to finsih off.

However, I felt something was missing, as the aim of this exercise to to be meaningful to a customer. Providing numbers and averages is useful but i felt didn't have enough depth. So I thought implementing a visual map of the bays would:

1. Allow for more insights
2. Allow for future implementation

As I wanted to do this, I used ChatGPT on tips of displaying Map Data in react. I used the prompt:

- "Can you create a React component that shows data points on a map with colored markers"

From this and trial and error, i managed to generated a colored map with the bays displayed.

This exercise was quite fun and am glad I had the opportunity to attempt this. I learned more about React and this activity is something that I will continue working on in the future to improve on.



