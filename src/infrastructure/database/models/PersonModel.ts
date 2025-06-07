import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config';

export interface PersonInstance extends Model<
  InferAttributes<PersonInstance>,
  InferCreationAttributes<PersonInstance>
> {
  businessEntityId: CreationOptional<number>;
  personType: string;
  nameStyle: boolean;
  title: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  emailPromotion: number;
  modifiedDate: Date;
}

export const Person = sequelize.define<PersonInstance>(
  'Person',
  {
    businessEntityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'BusinessEntityID',
      autoIncrement: true
    },
    personType: {
      type: DataTypes.CHAR(2),
      field: 'PersonType',
      allowNull: false
    },
    nameStyle: {
      type: DataTypes.BOOLEAN,
      field: 'NameStyle',
      allowNull: false,
      defaultValue: false
    },
    title: {
      type: DataTypes.STRING(8),
      field: 'Title',
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      field: 'FirstName',
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING(50),
      field: 'MiddleName',
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(50),
      field: 'LastName',
      allowNull: false
    },
    suffix: {
      type: DataTypes.STRING(10),
      field: 'Suffix',
      allowNull: true
    },
    emailPromotion: {
      type: DataTypes.INTEGER,
      field: 'EmailPromotion',
      allowNull: false,
      defaultValue: 0
    },
    modifiedDate: {
      type: DataTypes.DATE,
      field: 'ModifiedDate',
      allowNull: false
    }
  },
  {
    tableName: 'Person',
    schema: 'Person',
    timestamps: false
  }
); 