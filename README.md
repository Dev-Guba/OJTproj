# OJTproj
Asset Management using ORM and React + Vite and Express. Highlighting MVC Structured System

### It would be the best if you clone this one in SourceTree
Go to SourceTree
Clone Repositories
Create / Add Branch

### Backend installation ###

```bash
cd Backend
npm install
```


### Running The Backend ###
```bash
npm start
```

### Sequelize installation ###

```bash
cd Backend
npm install sequelize sequelize-cli tedious
npx sequelize-cli init
```

### Migration ###


```bash
cd Backend
npx sequelize-cli db:migrate
```

### Undo:Migration ###

```bash
cd Backend
npx sequelize-cli db:undo
```

### SEED DATABASE ###

```bash
cd Backend
npx sequelize-cli db:seed:all
```