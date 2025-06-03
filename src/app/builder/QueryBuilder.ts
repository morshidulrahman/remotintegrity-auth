import { Query, Document, FilterQuery, Model } from 'mongoose';

class QueryBuilder<T extends Document> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Handle global search across multiple fields
  globalSearch(searchableFields: string[], numericFields: string[] = []) {
    const globalSearch = this.query?.globalSearch as string;

    if (globalSearch && globalSearch.trim() && searchableFields.length > 0) {
      const searchConditions: any[] = [];

      // Handle text fields with regex
      const textFields = searchableFields.filter(field => !numericFields.includes(field));
      textFields.forEach(field => {
        searchConditions.push({
          [field]: {
            $regex: globalSearch.trim(),
            $options: 'i'
          }
        });
      });

      // Handle numeric fields
      const numericSearch = Number(globalSearch.trim());
      if (!isNaN(numericSearch) && numericFields.length > 0) {
        numericFields.forEach(field => {
          if (searchableFields.includes(field)) {
            searchConditions.push({
              [field]: numericSearch
            });
          }
        });
      }

      if (searchConditions.length > 0) {
        const searchFilter: FilterQuery<T> = {
          $or: searchConditions
        } as FilterQuery<T>;

        this.modelQuery = this.modelQuery.find(searchFilter);
      }
    }
    return this;
  }

  // Handle date range filtering
  dateRange(dateField: string = 'date') {
    const startDate = this.query?.startdate as string;
    const endDate = this.query?.enddate as string;

    if (startDate || endDate) {
      const dateFilter: any = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of day
        dateFilter.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        dateFilter.$lte = end;
      }

      const rangeFilter: FilterQuery<T> = {
        [dateField]: dateFilter
      } as FilterQuery<T>;

      this.modelQuery = this.modelQuery.find(rangeFilter);
    }
    return this;
  }

  // Handle field-based filtering
  filter() {
    const queryObj = { ...this.query };

    // Exclude fields that are not for filtering
    const excludeFields = ['globalSearch', 'sortBy', 'order', 'page', 'limit', 'fields', 'startdate', 'enddate'];
    excludeFields.forEach(field => delete queryObj[field]);

    // Handle special filters
    if (queryObj.isDeleted !== undefined) {
      queryObj.isDeleted = queryObj.isDeleted === 'true';
    }

    // Only apply filter if there are remaining query parameters
    if (Object.keys(queryObj).length > 0) {
      const filterQuery: FilterQuery<T> = queryObj as FilterQuery<T>;
      this.modelQuery = this.modelQuery.find(filterQuery);
    }

    return this;
  }

  // Handle sorting
  sort() {
    const sortBy = this.query?.sortBy as string || 'createdAt';
    const order = this.query?.order as string || 'desc';

    const sortOrder = order === 'desc' ? '-' : '';
    const sortString = `${sortOrder}${sortBy}`;

    this.modelQuery = this.modelQuery.sort(sortString);
    return this;
  }

  // Handle pagination
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Handle field selection
  fields() {
    const fields = this.query?.fields as string;
    if (fields) {
      const fieldList = fields.split(',').join(' ');
      this.modelQuery = this.modelQuery.select(fieldList);
    }
    return this;
  }

  // Get count for pagination metadata
  async countTotal(): Promise<number> {
    const filter = this.modelQuery.getFilter() as FilterQuery<T>;
    const model = this.modelQuery.model as Model<T>;
    const total = await model.countDocuments(filter);
    return total;
  }

  // Execute the query and return results with metadata
  async execute() {
    const total = await this.countTotal();
    const currentPage = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    const result = await this.modelQuery.exec();

    return {
      data: result,
      meta: {
        totalPages,
        currentPage,
        total
      }
    };
  }
}

export default QueryBuilder;
