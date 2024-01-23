export interface ICharacteristicType{
    id: string
    category: string
    name: string
    is_filtered: boolean
    characteristics: ICharacteristic[]
}
export interface ICharacteristic{
    id: string
    name: string
    type: string
}
export interface ICharacteristicWithTypeName extends ICharacteristic{
    characteristics_type: {
        name: string
    }
}
