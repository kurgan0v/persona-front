

interface CategoriesResponse{
    id: string
    link?: string
    section: {
        link: string
    }
}
interface ProductsResponse{
    id: string
    category: CategoriesResponse
}
export default async function sitemap() {
    const homepage = "https://xn--64-6kct4bffjj.xn--p1ai";
    const routes = ["", "/men", "/women", "/boys", "/girls", "/uniform", "/personal"].map((route) => ({
        url: `${homepage}${route}`,
        lastModified: new Date().toISOString(),
    }));
    const categories = await fetch(`${homepage}/api/sitemap/categories`, {next: {revalidate: 0}});
    const dataCategories: CategoriesResponse[] = await categories.json();
    const categoriesUrl = dataCategories.map((c) => ({
        url: `${homepage}/${c.section.link}/${c.link ? c.link : c.id}`,
        lastModified: new Date().toISOString(),
    }));
    const products = await fetch(`${homepage}/api/sitemap/products`, {next: {revalidate: 0}});
    const dataProducts: ProductsResponse[] = await products.json();
    const productsUrl = dataProducts.map((c) => ({
        url: `${homepage}/product/${c.id}`,
        lastModified: new Date().toISOString(),
    }));
    return [...routes, ...categoriesUrl, ...productsUrl];
}
