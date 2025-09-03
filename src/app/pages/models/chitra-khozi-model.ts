export class ChitraKhoziModel {
    isSuccess: boolean = false
    message!: string
    data!: ChitrakhoziDetail[]
    recordsTotal!: number
    recordsFiltered!: number
}
  
  
  export class ChitrakhoziDetail {
    pid_no!: number
    prisoner_name!: string
    state_code!: string
    dist!: number
    statename!: string
    photo!: string
    fathername!: string
    gender!: string
    age!: string
    location!: string
    jailname!: string
  }


  export class CCTNSKhojiDetail{
    fir_number!: number
    name!: string
    image!: string
    accuracy!: number
  }