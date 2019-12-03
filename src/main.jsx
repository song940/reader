import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
  useParams,
} from 'react-router-dom';
import XmlQuery from 'xml-query';
import XmlReader from 'xml-reader';

const { useState, useEffect } = React;

const fetchFeeds = async () => {
  const response = await fetch('./data/feeds.json');
  const feeds = await response.json();
  return feeds;
}

const Sidebar = () => {
  const { push } = useHistory();
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    fetchFeeds().then(setFeeds);
  }, []);
  return (
    <div className="sidebar" >
      <h1 className="title" >Reader</h1>
      <section className="group" >
        <div>
          <h3 className="group-name" ></h3>
        </div>
        <ul>
          {
            feeds.map(feed => <li key={feed.id} className="feed" onClick={() => push(`/${feed.id}`)} >{feed.name}</li>)
          }
        </ul>
      </section>
    </div>
  );
};

const Header = ({ title }) => {
  return (
    <header className="header" >
      <h1>{title}</h1>
    </header>
  );
};

const fetchFeedEntry = url => {
  return Promise
    .resolve()
    .then(() => fetch('./data/36kr.xml'))
    .then(response => response.text())
    .then(XmlReader.parseSync)
    .then(XmlQuery)
    .then(parseRSS)
};

const parseItem = item => {
  return item.children.reduce((obj, child) => {
    obj[child.name] = child.value || child.children && child.children[0] && child.children[0].value || child.attributes;
    return obj;
  }, {});
}

const parseRSS = doc => {

  return {
    title: doc.find('title').get(0).children[0].value,
    items: doc.find('item').map(parseItem)
  }
};

const FeedList = () => {
  const { id } = useParams();
  const { push } = useHistory();
  const [feed, setFeed] = useState({});
  useEffect(() => {
    fetchFeedEntry().then(setFeed);
  }, []);
  return (
    <div className="feed-list" >
      <h2 className="feed-title" >{feed.title}</h2>
      {
        feed.items && (
          <ul>
            {
              feed.items.map((item, i) => (
                <li key={`${item.guid}-${i}`} className="feed-item" onClick={() => push(`/${id}/${feed.guid}`)} >
                  <h3 className="feed-item-title" title={item.description} >{item.title}</h3>
                  <span className="feed-item-pubdate" >{item.pubDate}</span>
                </li>
              ))
            }
          </ul>
        )
      }
    </div>
  );
};

const FeedReader = () => {
  return (
    <div></div>
  );
};

const Content = () => {
  return (
    <Router>
      <Switch>
        <Route path="/:id" children={<FeedList />} ></Route>
        <Route path="/:id/:feed" children={<FeedReader />} ></Route>
      </Switch>
    </Router>
  );
};

const Article = () => {
  return (
    <div className="article" >
      <Header />
      <Content />
    </div>
  );
};

const Home = () => {
  return (
    <div className="reader" >
      <Sidebar />
      <Article />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" children={<Home />} />
      </Switch>
    </Router>
  )
};

ReactDOM.render(<App />, document.getElementById('app'))