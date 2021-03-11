var newsMaker = {
    news: null,
    feedData: null,
    fullnewsMaker: function() {
        return domMaker.init({
            type: "div",
            id: "fullNews",
            className: "closed",
        });
    },
    newsTitleMaker: function() {
        let rssName = "Custom Feed";
        if(!config.customRSS) {
            switch(config.RSSFeeds) {
                case "https://www.reddit.com/r/jailbreak/.rss":
                    rssName = "r/Jailbreak";
                    break;
                case "https://www.reddit.com/r/iOSThemes/.rss":
                    rssName = "r/iOSThemes";
                    break;
                case "https://www.reddit.com/r/news/.rss":
                    rssName = "r/News";
                    break;
                case "https://www.wired.com/feed":
                    rssName = "Wired";
                    break;
                case "https://www.theverge.com/rss/frontpage":
                    rssName = "Verge";
                    break;
                case "http://feeds.reuters.com/reuters/scienceNews":
                    rssName = "Science";
                    break;
                case "https://www.nasa.gov/rss/dyn/breaking_news.rss":
                    rssName = "NASA";
                    break;
                case "http://rss.cnn.com/rss/cnn_topstories":
                    rssName = "CNN";
                    break;
                case "http://feeds.feedburner.com/Mashable":
                    rssName = "Mashable";
                    break;
                case "https://www.forbes.com/most-popular/feed/":
                    rssName = "Forbes";
                    break;
                case "https://www.cnet.com/rss/news/":
                    rssName = "CNET";
                    break;
                case "http://www.espn.com/espn/rss/news":
                    rssName = "ESPN";
                    break;
                case "http://www.theonion.com/feeds/rss":
                    rssName = "Onion";
                    break;
                case "http://feeds.feedburner.com/thedailybeast/articles":
                    rssName = "Daily Beast";
                    break;
                default: 
                    rssName = "Custom Feed";
                    break;
            }
        }        
        return domMaker.init({
            type: "div",
            id: "newsHeader",
            innerHTML: `
            <div class='heading'>News</div>
            <div id='newsTitle' class='subHeading'>${rssName}</div>
            `
        });
    },
    newsHeadlinesMaker: function() {
        return domMaker.init({
            type: "div",
            id: "newsHeadlines"
        });
    },
    launchLink: function(link) {
        window.location = link;
    },
    closeFullNews: function(link) {
        let fullNews = document.getElementById("fullNews");
        fullNews.classList.add("closed");
        setTimeout(() => document.getElementById("fullNews").innerHTML = "", 350);
    },
    cleanContent: function(content) {
        content = content.replace(/<script[\\r\\\s\S]*<\/script>/mgi, "");
        content = content.replace(/<iframe.+?<\/iframe>/g, '');
        content = content.split('<div class="feedflare">');
        content = content[0];
        content = content.split('More about');
        content = content[0];
        if(!content.split('/')[1]) {
            content = `<p>${content}</p>`;
        }
        return content;
    },
    showFullNews: function(link) {
        let rssBody = document.getElementById("fullNews");
        for(let i = 0; i < this.feedData.length; i++) {
            if(this.feedData[i].link === link) {
                let content = `
                <div class='newsHeader'>
                    <div onclick=newsMaker.launchLink("${link}")>
                        Open Article
                    </div>
                    <div onclick=newsMaker.closeFullNews("${link}")>
                        Close
                    </div>
                </div>
                <div class='newsBody'>
                    <div class='heading'>${this.feedData[i].title}</div>
                    <div class='content'>${newsMaker.cleanContent(this.feedData[i].content)}</div>
                </div>
                `;
                rssBody.innerHTML = content;
            }
        }
        setTimeout(() => rssBody.classList.remove("closed"), 350);
    },
    getDates(date) {
        let months = Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        let dateObj = new Date(date),
            theDate = dateObj.getDate(),
            theMonth = months[dateObj.getMonth()],
            theYear = dateObj.getFullYear();
        return {
            date: theDate,
            month: theMonth,
            year: theYear
        }
    },
    cleanFeed: function() {
        this.feedData = null;
        if(document.getElementById('newsHeadlines')) {
            document.getElementById('newsHeadlines').innerHTML = '';
        }
    },
    feedParser: function(data) {
        this.cleanFeed;
        let entries = data.responseData.feed.entries;
        newsMaker.feedData = entries;
        for(let i = 0; i < entries.length; i++) {
            let entry = newsMaker.feedData[i],
                title = entry.title,
                link = entry.link,
                date = entry.publishedDate,
                author = entry.author,
                dateObj = newsMaker.getDates(date);
            theDate = dateObj.month + " " + dateObj.date + " - " + author;
            // if(document.getElementById("newsTitle").innerHTML == "Quotes") {
            //     title = title + ": " + body;
            // }
            title = title.substring(0, 100);
            if(theDate.length > 60) {
                theDate = theDate.substring(0,50);
                theDate = theDate + "...";
            }
            let div = domMaker.init({
                type: "div",
                id: "newsHeadline" + i,
                className: "newsHeadlines",
                innerHTML: `
                <div id='newsHeadlineDate${i}' class='newsHeadlineDate'>
                    ${theDate}
                </div>
                <div class='theHeadline'>
                    <a onclick=newsMaker.showFullNews("${link}")>${title}</a>
                </div>
                `
            });
            newsMaker.news.appendChild(div);
        }
    },
    getFeed: function(feed, parseFeed) {
        let apiURL = `http://feedrapp.info?&q=${feed}&num=15`;
        JSONP(apiURL, parseFeed);
    },
    loadFeed: function() {
        let feed = config.customRSS ? config.customRSSURL : config.RSSFeeds;
        newsMaker.getFeed(feed, newsMaker.feedParser);
        setTimeout(this.loadFeed, 60000 * 120);
    },
    init: function() {
        let fullnews = this.fullnewsMaker();
        let newsTitle = this.newsTitleMaker();
        this.news = this.newsHeadlinesMaker();
        this.loadFeed();
        domMaker.domAppender({
            div: loadWidget.contentContainer,
            children: [fullnews, newsTitle, this.news]
        });
    }
}