import {quotesApi} from './api';
export async function submitQuoteRequest(data){
 const id = `SZ-${crypto.randomUUID()}`;
 const result = await quotesApi.submitPublicQuote({...data,id});
 if(!result.success) throw new Error('The request could not be saved. Please try again or call Szine.');
 return {...result,success:true,quoteId:result.id || id};
}
