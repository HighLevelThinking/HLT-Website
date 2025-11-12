// Source - https://stackoverflow.com/a
// Posted by Mac, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-12, License - CC BY-SA 4.0

export const getCookieValue = (name:string) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)
export function setCookieValue(name:string, value:any, days:number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie. The 'path=/' makes it available across your whole site.
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}