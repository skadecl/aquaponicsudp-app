export class SPUError {
  public message: string;
  public sampledate: string;

  constructor(
    _message: string,
    _sampledate: string,
  ) {
    this.message = _message;
    this.sampledate = _sampledate;
  }
}
