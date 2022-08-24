const ProductPrice = ({ product }) => {
    return product.discountPercentage > 0 ? (
      <p>
        <span style={{textDecoration:'line-through'}}>LE {product.price}</span>&nbsp;&nbsp;
        <span style={{color:'red'}}>LE {product.netPrice} ({product.discountPercentage}% OFF)</span>
      </p>
    ) : (
      <p>LE {product.netPrice}</p>
    );
  };

  export default ProductPrice