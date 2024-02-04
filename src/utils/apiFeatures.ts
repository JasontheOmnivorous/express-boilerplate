import { Document, Query } from "mongoose";

class ApiFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: any;

  constructor(query: Query<T[], T>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el: string) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match: string) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(", ").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // modify to your desired field to sort, minus means descending order
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(", ").join(" ");
      this.query = this.query.select(fields);
    } else {
      // modify to your desired fields to limit, minus means "dont show" here
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10; // config to your desired limit to show
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;
