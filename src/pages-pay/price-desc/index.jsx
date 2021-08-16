import { View, Text } from '@tarojs/components';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { exportPoint } from '../../utils/common/exportPoint';
import './index.scss';

export default class PriceDesc extends CommonPageComponent {
  constructor(props) {
    super(props);
  }

  config = {
    navigationBarTitleText: '价格说明',
  };

  componentDidMount() {
    exportPoint(this.$router);
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  render() {
    return (
      <View className='price-desc'>
        <View className='fresh-price price'>
          <View className='icon' />
          <Text className='title'>七鲜销售价：</Text>
          <Text>
            七鲜销售价为商品的销售价，是您最终决定是否购买商品的依据。
          </Text>
        </View>
        <View className='fresh-price price'>
          <View className='icon' />
          <Text className='title'>七鲜价：</Text>
          <Text>
            对于商品页面上已标明为“七鲜价”的商品执行该价格，且对标有“七鲜价”商品实行买贵包赔政策，具体可查阅《七鲜关于七鲜价商品“买贵包赔”政策》。
          </Text>
        </View>
        <View className='underline-price price'>
          <View className='icon' />
          <Text className='title'>划线价：</Text>
          <Text>
            商品展示的划横线价格为参考价，并非原价，该价格可能是品牌专柜标价、商品吊牌价或由品牌供应商提供的正品零售价（如厂商指导价、建议零售价等）或该商品在七鲜APP上、实体门店曾经展示过的销售价；由于地区、时间的差异性和市场行情波动，品牌专柜标价、商品吊牌价等可能会与您购物时展示的不一致，该价格仅供您参考。
          </Text>
        </View>
        <View className='price'>
          <View className='icon' />
          <Text className='title'>折扣：</Text>
          <Text>
            如无特殊说明，折扣指销售商在原价、或划线价（如品牌专柜标价、商品吊牌价、厂商指导价、厂商建议零售价）等某一价格基础上计算出的优惠比例或优惠金额；如有疑问，您可在购买前联系七鲜客服进行咨询。
          </Text>
        </View>
        <View className='price'>
          <View className='icon' />
          <Text className='title'>异常问题：</Text>
          <Text>
            商品促销信息以商品详情页“促销”栏中的信息为准；商品的具体售价以订单结算页价格为准；如您发现活动商品售价或促销信息有异常，建议购买前先联系七鲜客服咨询。
          </Text>
        </View>
      </View>
    );
  }
}
