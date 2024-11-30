declare module '@bbob/preset-html5' {
    type Preset = Record<unknown, unknown>

    // eslint-disable-next-line @typescript-eslint/naming-convention
    function presetHTML5(): Preset

    export default presetHTML5
    export { Preset }
}
