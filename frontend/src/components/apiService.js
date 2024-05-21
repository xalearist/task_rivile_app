import axios from 'axios';
import * as FXP from 'fast-xml-parser';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const RIVILE_API_KEY = process.env.REACT_APP_RIVILE_API_KEY;

export const fetchData = async (methodName) => {
    const xmlRequestBody = `<?xml version="1.0" encoding="UTF-8"?>
    <body>
        <method>${methodName}</method>
        <params>
            <list>H</list>
        </params>
    </body>`;

    try {
        const response = await axios.post(`${API_BASE_URL}/client/v2`, xmlRequestBody, {
            headers: {
                'ApiKey': `${RIVILE_API_KEY}`,
                'Content-Type': 'application/xml'
            }
        });
        const options = {
            ignoreAttributes : false,
            attributeNamePrefix : ""
        };
        const parser = new FXP.XMLParser(options);
        const parsedData = parser.parse(response.data);
        return parsedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
