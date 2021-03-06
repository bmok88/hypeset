import React, { Component, PropTypes as T } from 'react';
import Articles from './Articles';

const propTypes = {
  brandName: T.string,
  brandCondensedName: T.string.isRequired,
  brandNews: T.array.isRequired,
  brandSales: T.array.isRequired,
  isFetchingBrandInfos: T.bool.isRequired,
  getBrandInfos: T.func.isRequired,
  resetBrandInfos: T.func.isRequired,
};

export default class Brand extends Component {
  constructor(props) {
    super(props);
    this.state ={
      selected: 'news',
    };
    this.changeTabs = this.changeTabs.bind(this);
    this.renderArticles = this.renderArticles.bind(this);
    this.retrieveNewBrandInfos = this.retrieveNewBrandInfos.bind(this);
  }

  componentDidMount() {
    this.retrieveNewBrandInfos(this.props.params.brand);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.brand !== nextProps.params.brand) {
      this.props.resetBrandInfos();
      this.retrieveNewBrandInfos(nextProps.params.brand);
    }
  }

  retrieveNewBrandInfos(brand) {
    this.props.getBrandInfos({ brand, offset: 0, limit: 20 });
  }

  changeTabs(tab) {
    this.setState({ selected: tab });
  }

  renderArticles() {
    const { selected } = this.state;
    const { params, brandCondensedName, brandNews, brandSales, getBrandInfos, isFetchingBrandInfos } = this.props;
    const base = {
      brand: brandCondensedName || params.brand,
      isFetchingAllArticles: isFetchingBrandInfos,
      isFetchingOwnArticles: isFetchingBrandInfos,
      getAllArticles: getBrandInfos,
      getOwnArticles: getBrandInfos,
      shouldFilter: false,
      type: selected,
    };
    const brandNewsProps = { ...base, articles: brandNews || [] };
    const brandSalesProps = { ...base, articles: brandSales || [] };
    if (selected === 'news') {
      return (
        <Articles {...brandNewsProps} />
      );
    }
    return (
      <Articles {...brandSalesProps} />
    );
  }

  render() {
    return (
      <section className="brands-brand">
        <h1>{this.props.brandName}</h1>
        <ul className="brands-brand-tabs">
          <li className="brands-brand-tabs-news" onClick={() => this.changeTabs('news')}>News</li>
          <li className="brands-brand-tabs-sales" onClick={() => this.changeTabs('sales')}>Sales</li>
        </ul>
        <section className={`brands-brand-articles ${this.state.selected === 'news' ? 'news' : 'sales'}`}>
          {this.renderArticles()}
        </section>
      </section>
    );
  }
}

Brand.propTypes = propTypes;
