export interface IPriceConfiguration {
    [key: string]:{
       priceType: "base" | "additional",
       availableOptions: Array<string>;
    }
   }
   
export interface IAttributeConfiguration {
       name: string,
       widgetType: "radio" | "switch",
       defaultValue: string,
       availableOptions: Array<string>
   }
   
export interface ICategory {
    name: string;
    priceConfiguration: IPriceConfiguration;
    attributeConfiguration: Array<IAttributeConfiguration>;
    hasToppings: boolean;
}