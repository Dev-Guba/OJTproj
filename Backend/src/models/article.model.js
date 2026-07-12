import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Article = sequelize.define(
    "Articles",
    {
        ArticleId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        article:{
            type:DataTypes.STRING,
            allowNull:false
        },

        description:{
            type:DataTypes.STRING(255),
            allowNull:true
        },

        propNumber:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },

        dateAcquired:{
            type:DataTypes.DATEONLY,
            allowNull:true
        },

        unit:{
            type:DataTypes.STRING,
            allowNull:true
        },

        unitValue:{
            type:DataTypes.DECIMAL(18,2),
            allowNull:true
        },

        balQty:{
            type:DataTypes.DECIMAL(18,2),
            allowNull:true
        },

        balValue:{
            type:DataTypes.DECIMAL(18,2),
            allowNull:true
        }

    },
    {
        tableName:"Articles",
        timestamps:true,
        freezeTableName:true
    }
);


export default Article;