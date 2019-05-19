export default (url) => {
    const ele = document.createElement('a');
    ele.setAttribute('href', url);
    ele.setAttribute('download', '');
    ele.click();
};