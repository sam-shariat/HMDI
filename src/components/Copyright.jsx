import { BASE_URL, GITHUB_URL, TWITTER_URL } from "../utils/constants";

const Copyright = () => {
    return <div className="text-center pt-5 pb-2">
        <p className="text-secondary w-100 pt-2">
            Developed By
            <a href={TWITTER_URL} className='px-1 text-light'>Sam</a>
            Powered by Algorand. Source Code is Available on <a className='px-1 text-light' href={GITHUB_URL} >Github</a></p>
    </div>
}

export default Copyright;