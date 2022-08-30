import './ProductCard.css'
import ProductPrice from '../../../../shared/ProductPrice'
import { Image, Badge, Tag } from 'antd';
import MainListForm from '../../../../forms/MainListForm';

const ProductCard = (props) => {
    return (
        <>
            <Badge.Ribbon text={props.product.mainList}>
                <div key={props.product._id} className="image-card">
                    <Image width='15vw' preview={{ getContainer: '#root', zIndex: 1000000 }} src={props.product.photos[0].src} />
                    <div className="image-card-actions">
                        <p>{props.product.name}</p>
                        <ProductPrice product={props.product} />
                        <p>
                            <Tag color={props.product.variants.color}>color</Tag>
                            <Tag color='#6f42c1'>{props.product.variants.size}</Tag>
                        </p>
                        <MainListForm mainList={props.product.mainList} id={props.product._id}/>
                    </div>
                </div>
            </Badge.Ribbon> 
        </>
    )
}

export default ProductCard