<?php
class Screenr_Slider {
    public $has_video =  false;
    public $number_item = 0;
    public $items = array();
    public $data;
    function __construct( $data ) {
        if ( empty( $data ) ){
            return false;
        }
        $this->data =  $data;
        $this->number_item = count( $this->data );
    }

    function render( ){
        $slider_data =  array();
        //wp_get_attachment_url( get_post_thumbnail_id() );
        foreach ( ( array ) $this->data as $k => $item ){
            $item = wp_parse_args( $item, array(
                'layout'        => '',
                'content'       => '',
                'media'         => '',
                'position'      => '',
                'pd_top'        => '',
                'pd_bottom'     => '',
            ) );
            if ( ! $item['position'] ) {
                $item['position']  = 'center';
            }
            $item['pd_top'] = get_theme_mod( 'slider_pd_top' );
            $item['pd_bottom'] = get_theme_mod( 'slider_pd_bottom' );
            $slider_data[ $k ] = $this->render_item( $item );
        }

        return join( "\n", $slider_data );
    }
    

    function render_item( $item ){
        // if has filter for this item
        if ( $html = apply_filters( 'screenr_slider_render_item', '', $item ) ) {
            return $html;
        }
        
        $url = screenr_get_media_url( $item['media'] );

        $html = '<div class="swiper-slide slide-align-'.esc_attr( $item['position'] ).' slide-'.esc_attr( $item['layout'] ).'" style="background-image: url(\''.esc_attr( $url ).'\')">';

            $style  = '';
            if  ( $item['pd_top'] != '' ) {
                $style .='padding-top: '.floatval( $item['pd_top'] ).'%; ';
            }
            if  ( $item['pd_bottom'] != '' ) {
                $style .='padding-bottom: '.floatval( $item['pd_bottom'] ).'%; ';
            }
            if ( $style != '' ) {
                $style = ' style="'.$style.'" ';
            }
            $html .= '<div class="swiper-slide-intro">';
                $html .= '<div class="swiper-intro-inner"'.$style.'>';
                    $content = isset( $item['content_'.$item['layout'] ] ) ? $item['content_'.$item['layout'] ] : '';
                    if ( $content ) {
                        $html .= apply_filters( 'the_content', $content );
                    }

                $html .= '</div>';
            $html .= '</div>';
            $html .= '<div class="overlay"></div>';
        $html .= '</div>';
        return $html;
    }

}