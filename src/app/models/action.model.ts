export class Action {
  public id: number;
  public actuator: number;
  public status: number;
  public confirmed: number;
  public source: number;
  public attempts: number;
  public createdAt: string;

  constructor(
    _id: number,
    _actuator: number,
    _status: number,
    _confirmed: number,
    _source: number,
    _attempts: number,
    _createdAt: string
  ) {
    this.id = _id;
    this.actuator = _actuator;
    this.status = _status;
    this.confirmed = _confirmed;
    this.source = _source;
    this.attempts = _attempts;
    this.createdAt = _createdAt;
  }
}
