import { BaseStyles } from '@nice-boys/components';
import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';

import { backendClient } from '../backend_client';
import { logger } from '../logger';
import { ReactComponent as ActiveNodesSvg } from '../svgs/computing-cloud.svg';
import { ReactComponent as ConnectionsSvg } from '../svgs/modeling.svg';
import { ReactComponent as OrderbookSvg } from '../svgs/order-book-thing.svg';
import { colors } from '../theme';
import { VizceralTraffic } from '../types';

import { Card } from './Card';
import { Footer } from './Footer';
import { LineGraphWithTooltip } from './LineGraph';
import { Navigation } from './Navigation';
import { Vizceral } from './Vizceral';

const baseTraffic: VizceralTraffic = {
  // Which graph renderer to use for this graph (currently only 'global' and 'region')
  renderer: 'region',
  // since the root object is a node, it has a name too.
  name: 'Mesh Network',
  // OPTIONAL: The maximum volume seen recently to relatively measure particle density. This 'global' maxVolume is optional because it can be calculated by using all of the required sub-node maxVolumes.
  maxVolume: 100000,
  // list of nodes for this graph
  nodes: [],
  // list of edges for this graph
  connections: [],
};

const AppContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  max-width: 100vw;
  padding-left: 32px;
  padding-right: 32px;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const GraphContainer = styled.div`
  background-color: ${colors.greyBg};
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-left: 20px;
`;

const GraphHeaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100px;
  flex-direction: row;
  color: #fff;
  width: 100%;
  border-bottom: 2px solid #2e2e2e;
  padding-top: 20px;
  padding-bottom: 8px;
  padding-left: 20px;
`;

const GraphHeaderMetricContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  flex-direction: row;
`;

const GraphHeaderMetricLabel = styled.div`
  color: ${colors.secondaryText};
  font-size: 18px;
  padding-bottom: 10px;
`;

const GraphHeaderMetricValue = styled.div`
  color: ${colors.whiteText};
  font-size: 24px;
`;

const HeaderMetricDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`;

const MainGraphPanelContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

// todo(jj) Figure out how to do container ratio better w/out max height ?
// works for now...
const VizceralContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: 80%;
  padding: 0 16px;
`;

const SidePanelContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  overflow-y: auto;
  flex-basis: 300px;
  border-left: 2px solid #2e2e2e;
`;

const SidePanelHeaderContainer = styled.div`
  display: flex;
  height: 100px;
  border-bottom: 2px solid #2e2e2e;
  flex-direction: row;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LineGraphContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SidePanelHeaderLabel = styled.div`
  font-size: 24px;
  color: ${colors.whiteText};
`;

const SidePanelHeaderSecondaryLabel = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: ${colors.secondaryText};
  transition: 0.2s color;
  :hover {
    color: ${colors.zeroExGreen};
  }
`;

const RecentTradeTable = styled.table`
  width: calc(100% - 32px);
  color: #fff;
  margin: 10px 16px;
  box-sizing: border-box;
  max-height: 400px;
  overflow-y: auto;
`;

const RecentTradeTableHeaderRow = styled.tr`
  border-bottom: 2px solid #2e2e2e;
`;

const RecentTrandeTableDataRow = styled.tr`
  margin-bottom: 8px;
  margin-top: 8px;
`;

const TableHeaderItem = styled.th`
  padding-top: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
  height: 30px;
  padding: 10px;
`;

const TableDataItem = styled.td`
  margin-bottom: 8px;
  margin-top: 8px;
  height: 30px;
  padding-top: 10px;
`;

export const App: React.FC = () => {
  const [openOrderCount, setOpenOrderCount] = useState<number | undefined>(undefined);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);

  const handleNodeClick = (clickNodeEvent: any | undefined) => {
    if (!clickNodeEvent) {
      // Implies a blur
      return setSelectedNodeId(undefined);
    }
    setSelectedNodeId(clickNodeEvent.name);
  };

  const [traffic, setTraffic] = useState<VizceralTraffic>(baseTraffic);
  const [selectedNode] = selectedNodeId ? traffic.nodes.filter(x => x.name === selectedNodeId) : [];

  useEffect(() => {
    const fetchAndSetTrafficAsync = async () => {
      const graph = await backendClient.getVizsceralGraphAsync();
      setTraffic({
        ...baseTraffic,
        ...graph,
      });
    };
    // tslint:disable-next-line:no-floating-promises
    fetchAndSetTrafficAsync();
  }, []);

  // Set fake data...
  useEffect(() => {
    setOpenOrderCount(37312);
  }, []);

  let connectionCount;
  let activeNodes;
  if (traffic && traffic.nodes.length) {
    connectionCount = traffic.connections.length;
    activeNodes = traffic.nodes.length;
  }

  const recentTradeData = [
    {
      maker: 'ZRX',
      makerAmount: 1000.1,
      taker: 'DAI',
      takerAmount: 56.32,
      poolName: 'CoolPool',
      time: '9:50:15',
      id: '1',
    },
    {
      maker: 'ZRX',
      makerAmount: 1000.1,
      taker: 'DAI',
      takerAmount: 56.32,
      poolName: 'CoolPool',
      time: '9:50:15',
      id: '2',
    },
  ];
  return (
    <AppContainer>
      <Navigation />
      <Main>
        <Flex overflowY={'auto'} style={{ flexBasis: 370 }} flexDirection={'column'}>
          <Card title="trades" subtitle="last 24 hours">
            <LineGraphContainer>
              {/* TODO calculate width height w/ js */}
              <LineGraphWithTooltip
                width={370}
                height={200}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
            </LineGraphContainer>
          </Card>
          <Card maxHeight={400} overflowY={'auto'} title="recent trades" subtitle="last 24 hours">
            <RecentTradeTable>
              <RecentTradeTableHeaderRow>
                <TableHeaderItem>Maker</TableHeaderItem>
                <TableHeaderItem>Taker</TableHeaderItem>
                <TableHeaderItem>Pool</TableHeaderItem>
                <TableHeaderItem>Time</TableHeaderItem>
              </RecentTradeTableHeaderRow>
              {recentTradeData.map(trade => {
                return (
                  <RecentTrandeTableDataRow key={trade.id}>
                    <TableDataItem>
                      {trade.makerAmount} {trade.maker}
                    </TableDataItem>
                    <TableDataItem>
                      {trade.takerAmount} {trade.taker}
                    </TableDataItem>
                    <TableDataItem>{trade.poolName || 'none'}</TableDataItem>
                    <TableDataItem>{trade.time}</TableDataItem>
                  </RecentTrandeTableDataRow>
                );
              })}
            </RecentTradeTable>
          </Card>
          <Card title="volume" subtitle="last 24 hours">
            <LineGraphContainer>
              {/* TODO calculate width height w/ js */}
              <LineGraphWithTooltip
                width={370}
                height={200}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
            </LineGraphContainer>
          </Card>
        </Flex>
        <GraphContainer>
          <MainGraphPanelContainer>
            <GraphHeaderContainer>
              <GraphHeaderMetricContainer>
                <ActiveNodesSvg fill="#fff" width={40} height={40} />
                <HeaderMetricDataContainer>
                  <GraphHeaderMetricLabel>active nodes</GraphHeaderMetricLabel>
                  <GraphHeaderMetricValue>{activeNodes ? activeNodes.toLocaleString() : '-'}</GraphHeaderMetricValue>
                </HeaderMetricDataContainer>
              </GraphHeaderMetricContainer>
              {/* <HeaderVerticalDivider /> */}
              <GraphHeaderMetricContainer>
                <ConnectionsSvg fill={'#fff'} width={40} height={40} />
                <HeaderMetricDataContainer>
                  <GraphHeaderMetricLabel>connections</GraphHeaderMetricLabel>
                  <GraphHeaderMetricValue>
                    {connectionCount ? connectionCount.toLocaleString() : '-'}
                  </GraphHeaderMetricValue>
                </HeaderMetricDataContainer>
              </GraphHeaderMetricContainer>
              {/* <HeaderVerticalDivider /> */}
              <GraphHeaderMetricContainer>
                <OrderbookSvg fill="#fff" width={40} height={40} />
                <HeaderMetricDataContainer>
                  <GraphHeaderMetricLabel>open orders</GraphHeaderMetricLabel>
                  <GraphHeaderMetricValue>
                    {openOrderCount ? openOrderCount.toLocaleString() : '-'}
                  </GraphHeaderMetricValue>
                </HeaderMetricDataContainer>
              </GraphHeaderMetricContainer>
            </GraphHeaderContainer>
            <VizceralContainer>
              {traffic.nodes.length > 0 && (
                // Hack updating traffic does not work at the moment
                <Vizceral
                  traffic={traffic}
                  viewChanged={logger.bind(logger, 'viewChanged')}
                  viewUpdated={logger.bind(logger, 'viewUpdated')}
                  objectHighlighted={(e: any) => handleNodeClick(e)}
                />
              )}
            </VizceralContainer>
          </MainGraphPanelContainer>
          <SidePanelContainer>
            {selectedNode ? (
              <div>hello</div>
            ) : (
              <>
                <SidePanelHeaderContainer>
                  <SidePanelHeaderLabel>new orders</SidePanelHeaderLabel>
                  <SidePanelHeaderSecondaryLabel>filters</SidePanelHeaderSecondaryLabel>
                </SidePanelHeaderContainer>
              </>
            )}
          </SidePanelContainer>
        </GraphContainer>
      </Main>
      <Footer />
    </AppContainer>
  );
};
