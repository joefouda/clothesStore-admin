import { Divider } from "antd"
import "./FeaturesSectionControl.css";
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

    const specialCategoryChange = (specialCategory) => {
        axios.get(`http://localhost:3000/api/v1/product/specialCategory/${specialCategory}`, )
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
        <div className="main-slider-control-container">
            <div className="main-slider-control-container-content">
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
                <div className="main-slider-control-container-photos">
                    {searchProducts.map((product) => (
                        <ProductCard product={product} type='search'/>
                    ))}
                </div>
            </div>
            <div className="main-slider-control-container-content">
                <h1>Featured Products</h1>
                <Select placeholder="choose special category" onChange={specialCategoryChange}>
                    <Option value="regular">regular</Option>
                    <Option value="special-1">special-1</Option>
                    <Option value="special-2" >special-2</Option>
                    <Option value="special-3">special-3</Option>
                </Select>
                <Divider />
                <div className="main-slider-control-container-photos">
                    {products.length === 0?<Empty
                        description={
                            <span>
                                No Items
                            </span>
                        }
                    >
                    </Empty>:products.map((product) => (
                        <ProductCard product={product} type='display'/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturesSectionControl