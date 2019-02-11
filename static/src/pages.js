
const pages = {
    page1: () => {
        return import(/* webpackChunkName: "page1" */'./pages/page1');
    },
    page2: () => {
        return import(/* webpackChunkName: "page2" */'./pages/page2');
    },
};

pages.default = pages.page1;

export default pages;
