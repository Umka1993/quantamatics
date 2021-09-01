// scss.d.ts
declare module '*.css' {
    const content: { [className: string]: string; };
    export default content;
}
declare module '*.scss' {
    const content: { [className: string]: string; };
    export default content;
}
declare module "*.svg" {
    const content: any;
    export default content;
}