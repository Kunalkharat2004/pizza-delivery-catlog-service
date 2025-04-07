export interface IPriceConfiguration {
    [key: string]:{
       priceType: "base" | "additional",
       availableOptions: Array<string>;
    }
   }
   
export interface IAttributeConfiguration {
       name: String,
       widgetType: "radio" | "switch",
       defaultValue: string,
       availableOptions: Array<string>
   }
   
export interface ICategory {
       name: String,
       priceConfiguration: IPriceConfiguration,
       attributeConfiguration: Array<IAttributeConfiguration>
   }