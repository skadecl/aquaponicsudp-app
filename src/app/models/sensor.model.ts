export class Sensor {
  public id: number;
  public type: number;
  public name: string;
  public description: string;
  public unit: string;
  public status: number;
  public value: number;
  public min: number;
  public max: number;
  public avg: number;
  public count: number;
  public style: string;
  public icon: string;

  constructor(
    _type: number = -1,
    _name: string = '',
    _description: string = '',
    _unit: string = '',
    _status: number = 0,
    _value: number = 0,
    _min: number = 0,
    _max: number = 0,
    _avg: number = 0,
    _count: number = 0,
    _style: string = '',
    _icon: string = '',
    _id?: number
  ) {
    this.id = _id;
    this.type = _type;
    this.name = _name;
    this.description = _description;
    this.unit = _unit;
    this.status = _status;
    this.value = _value;
    this.min = _min;
    this.max = _max;
    this.avg = _avg;
    this.count = _count;
    this.style = _style;
    this.icon = _icon;
  }
}
