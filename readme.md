The node file is generated using 
The app uses Typescript with node.
1.npm init 
2.npm i express
3.npx tsc --init (make sure typescript is installed globally)

The typescript can not be directly run by node it compiles and creates the js out of ts .
In the tsconfig the  "outDir": "./dist" mentions where the compiled code would go ,so after compiling the whole code is to be present under "/dist".

The rest of the code is to be written inside the src and would be automatically taken to dist .

The default node_modules like fs can not be run directly by using the .ts ,
so for dev we need the install _npm i @types/node -D