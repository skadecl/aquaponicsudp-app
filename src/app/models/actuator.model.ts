export class Actuator {
  public id: number;
  public name: string;
  public description: string;
  public status: number;
  public lock: number;
  public icon: string;
  public style: string;

  constructor(
    _name: string = '',
    _description: string = '',
    _status: number = 0,
    _lock: number = 0,
    _icon: string = '',
    _style: string = '',
    _id?: number
  ) {
    this.id = _id;
    this.name = _name;
    this.description = _description;
    this.status = _status;
    this.lock = _lock;
    this.icon = _icon;
    this.style = _style;
  }
}
