import { CustomSanitizer, query } from 'express-validator';

const SearchNameTerm: CustomSanitizer = value => {
    if(!value){
        return ""
    }
    return value
}
export const searchNameTermSanitizer = query('searchNameTerm').customSanitizer(SearchNameTerm)

const SearchLoginTerm: CustomSanitizer = value => {
    if(!value){
        return ""
    }
    return value
}
export const searchLoginTermSanitizer = query('searchLoginTerm').customSanitizer(SearchLoginTerm)

const SearchEmailTerm: CustomSanitizer = value => {
    if(!value){
        return ""
    }
    return value
}
export const searchEmailTermSanitizer = query('searchEmailTerm').customSanitizer(SearchEmailTerm)

const PageNumber: CustomSanitizer = value => {
    if(!value || typeof value === "undefined"){
        return 1
    }
    return value
}
export const pageNumberSanitizer = query('pageNumber').customSanitizer(PageNumber)

const PageSize: CustomSanitizer = value => {
    if(!value || typeof value === "undefined") {
        return 10
    }
    return value
}
export const pageSizeSanitizer = query('pageSize').customSanitizer(PageSize)

const SortBy: CustomSanitizer = value => {
    if(!value){
        return "createdAt"
    }
    return value
}
export const sortBySanitizer = query('sortBy').customSanitizer(SortBy)

const SortDirection: CustomSanitizer = value => {
    if(!value || !value.includes('asc','desc')){
        return -1
    }
    if(value === "desc"){
        return -1
    }
    return 1
}
export const sortDirectionSanitizer = query('sortDirection').customSanitizer(SortDirection)