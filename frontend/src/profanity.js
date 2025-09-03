import filter from "leo-profanity"

filter.loadDictionary();
filter.add(filter.getDictionary("ru"));

export default filter;
