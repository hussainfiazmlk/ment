class QueryService {
  private query: any;
  private queryString: object;
  constructor(query: any, queryString: object) {
    this.query = query;
    this.queryString = queryString
  }

  sort() {
    if (this.queryString['sort']) {
      const sortBy: string = this.queryString['sort'].split(',').join(' ')
      this.query = this.query.sort(sortBy)
    }

    return this;
  }

  paginate() {
    const page: number = this.queryString['pagenumber'] * 1 || 1;
    const limit: number = this.queryString['pagesize'] * 1 || 12;
    const skip: number = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  filter() {
    const query: object = { ...this.queryString }
    const excludedFields = ['pagenumber', 'pagesize', 'sort'];
    excludedFields.forEach((el) => delete query[el]);

    const queryObj = {};

    Object.keys(query).forEach((key) => {
      const objKey = key;
      const objValue = query[key];
      const basicOp = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'];
      const mediumOp = ['in', 'nin'];

      if (typeof objValue === 'string') {
        queryObj[objKey] = objValue;
      } else if (Object.keys(objValue).length === 1) {
        for (const key in objValue) {
          if (basicOp.includes(key)) {
            queryObj[objKey] = { [`$${key}`]: objValue[key] };
          } else if (mediumOp.includes(key)) {
            queryObj[objKey] = { [`$${key}`]: objValue[key].split(',') };
          } else if (key === 'between') {
            const range = objValue[key].split(',');
            queryObj[objKey] = { [`$gte`]: range[0], [`$lte`]: range[1] };
          } else {
            queryObj[objKey] = { [`$${'eq'}`]: objValue[key] };
          }
        }
      }
    });

    this.query = this.query.find(queryObj);

    return this;
  }
}

export default QueryService;