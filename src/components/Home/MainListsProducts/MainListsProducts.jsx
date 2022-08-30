import { Divider } from "antd"
import "./MainListsProducts.css";
import { Input, Select, Empty } from "antd";
import { useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard/ProductCard";

const {Option} = Select

const FeaturesSectionControl = ()=>{
    const [searchName, setSearchName] = useState("");
    const [searched, toggleSearched] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchProducts, setSearchProducts] = useState([])

    const mainListChange = (mainList) => {
        axios.get(`http://localhost:3000/api/v1/product/mainList/${mainList}`, )
            .then((res) => {
                 setProducts(res.data.products);
            });
    };

    const handleChange = (event) => {
        setSearchName(event.target.value);
        if (!event.target.value.length) {
        setSearchProducts([]);
        toggleSearched();
        } else {
        axios
            .get(
            `http://localhost:3000/api/v1/product/search/${event.target.value}`
            )
            .then((res) => {
            if (res.data.products) {
                setSearchProducts(res.data.products);
            }
            toggleSearched(true);
            });
        }
    };
    return (
        <div className="featured-products-control-container">
            <div className="featured-products-control-container-content">
                <Input
                    placeholder="search and add new products to your lists"
                    size="large"
                    onChange={handleChange}
                />
                {searchProducts.length === 0 && searched && (
                    <h2 style={{ textAlign: "center" }}>
                    No results found for '{searchName}'
                    </h2>
                )}
                <Divider />
                <div className="featured-products-control-container-products">
                    {searchProducts.map((product) => (
                        <ProductCard key={product._id} product={product} type='search'/>
                    ))}
                </div>
            </div>
            <div className="featured-products-control-container-content">
                <h1>Featured Products</h1>
                <Select placeholder="choose special category" onChange={mainListChange}>
                    <Option value="regular">regular</Option>
                    <Option value="main-slider">main-slider</Option>
                    <Option value="special-1">special-1</Option>
                    <Option value="special-2" >special-2</Option>
                    <Option value="featured">featured</Option>
                </Select>
                <Divider />
                <div className="featured-products-control-container-products">
                    {products.length === 0?<Empty
                        description={
                            <span>
                                No Items
                            </span>
                        }
                    >
                    </Empty>:products.map((product) => (
                        <ProductCard key={product._id} product={product} type='display'/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturesSectionControl