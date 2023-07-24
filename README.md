
Trips-API


Breve resumen: 

En este proyecto se maneja una excelente escalabilidad y performance, asi llevando un equilibrio entre los dos para lograr un producto perfecto. 


- Domain-driver design(DDD) como estructura
- Inversify para la inyeccion de dependencias 
- Swc como compilador de typescript a Javascript y para los tests([Plataforma basada en Rust para la Web](https://swc.rs)) 
- Jest para los test
- Class-validator para la validación
- Mongodb sin mongoose([ Aqui puede leer sobre la diferencia de performances entre el driver de mongodb y mongoose, es practicamente tres veces mas rapido](https://jscrambler.com/blog/mongodb-native-driver-vs-mongoose-performance-benchmarks#:~:text=Overall%2C%20the%20native%20driver%20is,findById%20with%20the%20lean%20option)) 
- Express como framework 
- Axios para las consultas HTTP
- Docker, Docker Compose


Variables de entorno(agregar en archivo .env): 

```
PORT=

GOOGLE_API_KEY=
```



JSON de la colleccion de postman: <https://api.postman.com/collections/13030090-909dfe13-b539-4254-9094-ee38eeb7c446?access_key=PMAT-01H3Q3Y95MP381D801YC8BZN1T>


Repositorio: <https://github.com/EdisonJpp/trips-api>





**NOTA:** Me faltaron varios tests, solo que no tuve el tiempo suficiente para completarlos todo por el trabajo que actualmente tengo y otros inconvenientes.








