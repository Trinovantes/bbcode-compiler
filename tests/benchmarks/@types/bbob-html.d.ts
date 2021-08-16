declare module '@bbob/html' {
    import { Preset } from '@bobb/preset-html5'

    // eslint-disable-next-line @typescript-eslint/naming-convention
    function bbobHTML(input: string, preset: Preset): string

    export default { default: bbobHTML }
}
