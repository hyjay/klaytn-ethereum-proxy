export default interface ResultModifier {

  method(): string
  modify(result: JSON): void
}
