export default interface ResponseModifier {

  method(): string
  modify(response: JSON): void
}
