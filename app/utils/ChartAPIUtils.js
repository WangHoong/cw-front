import axios from 'axios'
import { APIHelper } from './APIHelper'

let ChartAPIUtil = {
	
	get (type) {
		console.log(type)
		return axios.get(APIHelper.getPrefix() + '/rpt/' + type, {
			withCredentials: true,
		})
	}
}

export default ChartAPIUtil