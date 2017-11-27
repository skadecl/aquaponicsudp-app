export class Alarm {
  public id: number;
  public sensor: number;
  public name: string;
  public description: string;
  public type: number;
  public status: number;
  public triggered: boolean;
  public value: number;
  public delta: number;
  public style: string;
  public icon: string;

  constructor(
    _sensor: number = 0,
    _name: string = '',
    _description: string = '',
    _type: number = -1,
    _status: number = 0,
    _triggered: boolean = false,
    _delta: number = 0,
    _style: string = '',
    _icon: string = '',
    _value?: number,
    _id?: number
  ) {
    this.id = _id;
    this.sensor = _sensor;
    this.name = _name;
    this.description = _description;
    this.type = _type;
    this.status = _status;
    this.triggered = _triggered;
    this.value = _value;
    this.delta = _delta;
    this.style = _style;
    this.icon = _icon;
  }
}
